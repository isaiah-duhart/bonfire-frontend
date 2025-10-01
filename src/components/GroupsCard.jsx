import { Link } from "@tanstack/react-router"

export default function GroupsCard({group}){

    return (
        <Link to={`/groups/${group.group_id}`} style={{ cursor: 'pointer' }}>{group.group_name}</Link>
    )
}