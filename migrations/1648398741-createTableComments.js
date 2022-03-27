exports.up = async (sql) => {
  await sql`
  CREATE TABLE comments (
		id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
		comment varchar (600) NOT NULL,
		user_id integer REFERENCES users (id) ON DELETE CASCADE,
		username varchar(100) REFERENCES users (username) ON DELETE CASCADE,
		image VARCHAR(100) REFERENCES users (image) ON DELETE CASCADE,
		post_id integer REFERENCES blogPosts (id) ON DELETE CASCADE
	);
	`;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE comments
  `;
};
