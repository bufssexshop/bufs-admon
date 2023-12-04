import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

const Page = () => {
  return <Editor />;
};

export default Page;
