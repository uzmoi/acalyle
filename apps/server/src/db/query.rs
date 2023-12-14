use crate::query::{OrdOp, SortOrder};
use sqlx::{QueryBuilder, Sqlite};

pub(crate) fn push_cursor_query(
    query_builder: &mut QueryBuilder<'_, Sqlite>,
    order_column_name: &str,
    op: OrdOp,
    cursor: &str,
    table_name: &str,
) {
    query_builder.push(order_column_name);
    query_builder.push(" ").push(op).push(" ");
    query_builder.push("(");
    let separated = &mut query_builder.separated(" ");
    separated.push("SELECT").push(order_column_name);
    separated.push("FROM").push(table_name);
    separated.push("WHERE id =").push_bind(cursor.to_string());
    query_builder.push(")");
}

pub(crate) fn push_ending_query(
    query_builder: &mut QueryBuilder<'_, Sqlite>,
    ordering: &[(&str, SortOrder)],
    limit: i32,
    offset: i32,
) {
    let mut separated = query_builder.separated(" ");
    separated.push("ORDER BY");
    for (order_by, order) in ordering {
        separated.push(order_by).push(order);
    }
    separated.push("LIMIT").push_bind(limit);
    separated.push("OFFSET").push_bind(offset);
}
