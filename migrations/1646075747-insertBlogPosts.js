const blogPosts = [
  {
    // id: '1',
    title: 'Vinyl Player',
    story: 'music tool',
  },
  {
    // id: '2',
    title: 'Guitar',
    story: 'music instrument',
  },
  {
    // id: '3',
    title: 'Saxophone',
    story: 'music instrument',
  },
  {
    // id: '4',
    title: 'Microfon',
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
