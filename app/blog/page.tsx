import Articles from './Articles/Articles';
import Featured from './Featured/Featured';
import Hero from './Hero/Hero';

const Blog = () => {
  return (
    <main style={{ backgroundColor: '#001812' }}>
      <Hero />
      <Featured />
      <Articles />
    </main>
  );
};

export default Blog;
