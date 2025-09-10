import type { Brand } from "@uzmoi/ut/types";
import type { PageInfo } from "./schema.gen";

class Listenable {
  subscriptions = new Set<() => void>();
  listen(f: () => void): () => void {
    this.subscriptions.add(f);
    return () => {
      this.subscriptions.delete(f);
    };
  }
  notifyId = 0;
  notify(): void {
    this.notifyId++;
    for (const flash of this.subscriptions) {
      flash();
    }
  }
}

export type Cursor = string & Brand<"GraphQL/Cursor">;

export interface GqlNode {
  id: string;
}

interface Edge<TNode> {
  cursor?: string;
  node: TNode;
}

type Page<TNode> =
  | { pageInfo: Omit<PageInfo, "__typename">; edges: readonly Edge<TNode>[] }
  | { pageInfo: Omit<PageInfo, "__typename">; nodes: readonly TNode[] };

export interface ConnectionSnapshot<TId> {
  nodeIds: TId[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export abstract class GraphqlConnection<
  TNode extends GqlNode,
> extends Listenable {
  hasPreviousPage = true;
  hasNextPage = true;

  constructor(
    public startCursor: Cursor | null = null,
    public endCursor: Cursor | null = null,
  ) {
    super();
  }

  nodeIds: TNode["id"][] = [];

  private _cache = new Map<number, ConnectionSnapshot<TNode["id"]>>();

  toConnectionSnapshot(): ConnectionSnapshot<TNode["id"]> {
    if (!this._cache.has(this.notifyId)) {
      this._cache.set(this.notifyId, {
        nodeIds: [...this.nodeIds],
        hasPreviousPage: this.hasPreviousPage,
        hasNextPage: this.hasNextPage,
      });
    }
    return this._cache.get(this.notifyId)!;
  }

  protected abstract fetchPage(
    cursor: Cursor | null,
    dir: "previous" | "next",
  ): Promise<Page<TNode>>;
  protected abstract updateNodes(nodes: readonly TNode[]): void;

  async loadPreviousPage(): Promise<void> {
    if (!this.hasPreviousPage) return;

    const page = await this.fetchPage(this.startCursor, "previous");

    {
      const { hasPreviousPage, startCursor } = page.pageInfo;
      this.hasPreviousPage = hasPreviousPage && startCursor != null;
      this.startCursor = startCursor as Cursor | null;
    }

    const nodes =
      "nodes" in page ? page.nodes : page.edges.map(edge => edge.node);

    this.nodeIds.splice(0, 0, ...nodes.map(node => node.id));

    this.updateNodes(nodes);
    this.notify();
  }
  async loadNextPage(): Promise<void> {
    if (!this.hasNextPage) return;

    const page = await this.fetchPage(this.endCursor, "next");

    {
      const { hasNextPage, endCursor } = page.pageInfo;
      this.hasNextPage = hasNextPage && endCursor != null;
      this.endCursor = endCursor as Cursor | null;
    }

    const nodes =
      "nodes" in page ? page.nodes : page.edges.map(edge => edge.node);

    const length = this.nodeIds.length;
    this.nodeIds.splice(length, 0, ...nodes.map(node => node.id));

    this.updateNodes(nodes);
    this.notify();
  }
}
