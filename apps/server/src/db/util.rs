use sqlx::{Database, Encode, QueryBuilder, Type};

pub trait QueryBuilderExt<'args, DB: Database> {
    fn push_bind_values<T>(&mut self, values: impl IntoIterator<Item = T>) -> &mut Self
    where
        T: 'args + Encode<'args, DB> + Send + Type<DB>;
}

impl<'args, DB: Database> QueryBuilderExt<'args, DB> for QueryBuilder<'args, DB> {
    fn push_bind_values<T>(&mut self, values: impl IntoIterator<Item = T>) -> &mut Self
    where
        T: 'args + Encode<'args, DB> + Send + Type<DB>,
    {
        self.push(" (");
        let mut separated = self.separated(", ");
        for value in values {
            separated.push_bind(value);
        }
        self.push(") ");

        self
    }
}
