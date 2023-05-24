#[derive(strum::Display)]
#[strum(serialize_all = "UPPERCASE")]
pub(crate) enum SortOrder {
    Asc,
    Desc,
}

pub(crate) struct NodeListQuery<F, O> {
    pub lt_cursor: Option<(String, bool)>,
    pub gt_cursor: Option<(String, bool)>,
    pub filter: F,
    pub order: SortOrder,
    pub order_by: O,
    pub limit: i32,
    pub offset: i32,
}
