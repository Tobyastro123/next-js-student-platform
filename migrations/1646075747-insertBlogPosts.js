const blogPosts = [
  {
    // id: '1',
    title: 'MA35',
    story: 'music tool',
  },
  {
    // id: '2',
    title: 'Master Business Informatics',
    story: 'music instrument',
  },
  {
    // id: '3',
    title: 'Anthropology',
    story: 'music instrument',
  },
  {
    // id: '4',
    title: 'Arts and History',
    story: 'music tool',
  },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO blogPosts ${sql(blogPosts, 'title', 'story')}
  `;
};

exports.down = async (sql) => {
  for (const blogPost of blogPosts) {
    await sql`
      DELETE FROM
			blogPosts
      WHERE
        title = ${blogPost.title} AND
        story = ${blogPost.story}
				`;
  }
};
