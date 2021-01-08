import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostQuery } from "../generated/graphql";

const Index = () => {
    const [{data}] = usePostQuery()
    
    return (
        <>
            <NavBar />
            <p>hello world</p>
            <br/>
            {!data? null: data.posts.map(p=> <div key={p.id}>{p.title}</div>)}
        </>
    )
}
export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
