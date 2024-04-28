import { ReactNode, useEffect, useState } from "react";
import { get } from "./util/http";
import BlogPosts, { BlogPost } from "./components/BlogPosts";
import FetchImg from "./assets/data-fetching.png"
import ErrorMessage from "./components/ErrorMessage";

type RawDataBlogPost = {
  id: number
  userId: number
  title: string
  body: string
}

function App() {
  const [fetchedPosts, setFetchedPosted] = useState<BlogPost[]>()
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  useEffect(()=>{
    setIsFetching(true)
    async function fetchPosts() {
      try {
        const data =  await get("https://jsonplaceholder.typicode.com/posts") as RawDataBlogPost[]
        const blogPosts: BlogPost[] = data.map(blogPost=>({
          id: blogPost.id,
          title: blogPost.title,
          text: blogPost.body
        }))
        setFetchedPosted(blogPosts)
      } catch (error) {
        setError((error as Error).message) 
      }
      setIsFetching(false)
    }
    fetchPosts()
  },[])

  let content: ReactNode

  if (error) {
    content = <ErrorMessage text={error}/>
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts}/>
  }

  if (isFetching) {
    content = <p id="loading-fallback">Fetching posts ...</p>
  }
  return <main>
    <img  src={FetchImg} alt="FetchImg" loading="lazy"/>
    {content}
  </main>;
}

export default App;
