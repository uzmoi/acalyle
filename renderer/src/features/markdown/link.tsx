import { css, cx } from "@linaria/core";
import normalizeUrl from "normalize-url";
import { ReactMarkdownProps } from "react-markdown/lib/ast-to-react";

export const MarkdownLink: React.FC<
    React.ComponentPropsWithoutRef<"a"> & ReactMarkdownProps
> = ({ node: _, href, className, children, ...restProps }) => {
    let normalizedUrl: string | undefined;
    try {
        if (href) {
            normalizedUrl = normalizeUrl(href, {
                defaultProtocol: "https",
            });
        }
    } catch {
        // noop
    }

    // https?以外のスキーマはMarkdownライブラリが"javascript:void(0)"にしてくれるが、念のため弾く
    if (normalizedUrl == null || !/^https?:/.test(normalizedUrl)) {
        return <span data-original-url={href}>{children}</span>;
    }

    return (
        <a
            {...restProps}
            className={cx(
                css`
                    color: #48e;
                `,
                className,
            )}
            href={normalizedUrl}
            data-original-url={href}
            target="_blank"
            rel="noreferrer noopener nofollow ugc"
        >
            {children}
        </a>
    );
};
