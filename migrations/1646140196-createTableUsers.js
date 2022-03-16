exports.up = async (sql) => {
  await sql`
    CREATE TABLE users (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      username varchar(30) NOT NULL UNIQUE,
      image VARCHAR(100) NOT NULL,
      password_hash varchar(60) NOT NULL
    );
  `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE users
  `;
};
