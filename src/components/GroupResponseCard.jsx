
export default function GroupResponseCard({groupResponse}){
    return (
        <li>{groupResponse.author}: {groupResponse.response} {groupResponse.created_at}</li>
    )
}