use once_cell::sync::Lazy;
use regex::Regex;

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

#[derive(Debug, PartialEq)]
pub struct QueryToken {
    pub negate: bool,
    pub key: Option<String>,
    pub value: String,
}

static RE: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r#"-?(?<key>[^\s:"']+:)?(?<value>'([^']|\\.)*'|"([^"]|\\.)*"|\S*)"#).unwrap()
});

impl QueryToken {
    pub fn parse(query: &str) -> Vec<QueryToken> {
        let tokens = RE.captures_iter(query).map(|captures| {
            // マッチした全体
            let mat = &captures[0];
            let negate = mat.len() >= 2 && mat.starts_with('-');

            let key = captures.name("key").map(|key| {
                let key = &key.as_str();
                // keyの末尾は:が付いているのでそれを取り除く
                key[..key.len() - 1].to_string()
            });
            let value = unquote(&captures["value"]).to_string();

            QueryToken { negate, key, value }
        });

        tokens.collect()
    }
}

fn is_quoted(v: &str) -> bool {
    (v.starts_with('"') && v.ends_with('"')) || (v.starts_with('\'') && v.ends_with('\''))
}

#[inline]
fn unquote(v: &str) -> &str {
    if is_quoted(v) {
        &v[1..v.len() - 1]
    } else {
        v
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    impl QueryToken {
        fn neg(self) -> QueryToken {
            QueryToken {
                negate: !self.negate,
                ..self
            }
        }
    }
    fn value(value: &str) -> QueryToken {
        QueryToken {
            negate: false,
            key: None,
            value: value.to_string(),
        }
    }
    fn key_value(key: &str, value: &str) -> QueryToken {
        QueryToken {
            negate: false,
            key: Some(key.to_string()),
            value: value.to_string(),
        }
    }

    #[test]
    fn word() {
        assert_eq!(QueryToken::parse("word"), vec![value("word")],);
    }

    #[test]
    fn negated_word() {
        assert_eq!(QueryToken::parse("-hoge"), vec![value("hoge").neg()],);
    }

    #[test]
    fn quoted() {
        assert_eq!(
            QueryToken::parse(r#""-word" -" ""#),
            vec![value("-word"), value(" ").neg()],
        );
    }

    #[test]
    fn escapes() {
        assert_eq!(
            QueryToken::parse(r#"\" "\"""#),
            vec![value(r#"""#), value(r#"""#)],
        );
    }

    #[test]
    fn keywords() {
        assert_eq!(
            QueryToken::parse("keyword:value1 keyword:value2"),
            vec![
                key_value("keyword", "value1"),
                key_value("keyword", "value2"),
            ]
        );
    }

    #[test]
    fn negated_keyword() {
        assert_eq!(
            QueryToken::parse("-keyword:value"),
            vec![key_value("keyword", "value").neg()]
        );
    }

    #[test]
    fn keywords_with_quoted_value() {
        assert_eq!(
            QueryToken::parse(r#"keyword:" ""#),
            vec![key_value("keyword", " ")]
        );
    }
}
