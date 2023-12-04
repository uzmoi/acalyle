#[derive(strum::Display)]
pub(crate) enum OrdOp {
    #[strum(serialize = ">")]
    GreaterThan,
    #[strum(serialize = ">=")]
    GreaterThanOrEqual,
    #[strum(serialize = "<")]
    LessThan,
    #[strum(serialize = "<=")]
    LessThanOrEqual,
}

impl OrdOp {
    pub fn gt(eq: bool) -> OrdOp {
        if eq {
            OrdOp::GreaterThanOrEqual
        } else {
            OrdOp::GreaterThan
        }
    }
    pub fn lt(eq: bool) -> OrdOp {
        if eq {
            OrdOp::LessThanOrEqual
        } else {
            OrdOp::LessThan
        }
    }
}

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
