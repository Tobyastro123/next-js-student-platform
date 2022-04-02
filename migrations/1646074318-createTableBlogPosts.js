exports.up = async (sql) => {
  // <insert magic here>
  await sql`
		CREATE TABLE blogPosts (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			title varchar(120) NOT NULL,
			story varchar(9999) NOT NULL,
			image VARCHAR(100) NOT NULL
		);
	`;
};

exports.down = async (sql) => {
  // just in case...
  await sql`
	DROP TABLE blogPosts
	`;
};
