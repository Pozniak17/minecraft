import Articles from './Articles/Articles';
import Featured from './Featured/Featured';
import Hero from './Hero/Hero';
import Newsletter from './Newsletter/Newsletter';

const Blog = () => {
  return (
    <main style={{ backgroundColor: '#001812' }}>
      <Hero />
      <Featured />
      <Articles />
      <Newsletter />
    </main>
  );
};

export default Blog;
