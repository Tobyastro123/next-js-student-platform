exports.up = async (sql) => {
  // <insert magic here>
  await sql`
		CREATE TABLE blogPosts (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			username varchar(100) REFERENCES users (username) ON DELETE CASCADE,
			title varchar(120) NOT NULL,
			story varchar(9999) NOT NULL,
			topic varchar(100) NOT NULL
		);
	`;
};

exports.down = async (sql) => {
  // just in case...
  await sql`
	DROP TABLE blogPosts
	`;
};
