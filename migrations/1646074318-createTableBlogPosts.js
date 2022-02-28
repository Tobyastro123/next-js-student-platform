exports.up = async (sql) => {
  // <insert magic here>
  await sql`
		CREATE TABLE blogPosts (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			title varchar(20) NOT NULL,
			story varchar(330) NOT NULL
		);
	`;
};

exports.down = async (sql) => {
  // just in case...
  await sql`
	DROP TABLE blogPosts
	`;
};
