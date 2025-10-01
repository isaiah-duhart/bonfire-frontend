import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { API_URL } from '../../config'
import GroupsCard from '../../components/GroupsCard'

export const Route = createFileRoute('/groups/')({
	component: GroupsPage,
})

function GroupsPage() {
    const { jwt } = useAuth()
    const { data, isPending, error } = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
        const response = await fetch(`${API_URL}/api/groups`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${jwt}`}
        })
        if (!response.ok) {
            throw new Error('Failed to fetch groups')
        }
        return response.json()
        },
    })

    if (isPending) return <p>Loading groups...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
    <>
        <div>
        <h2>Your Groups</h2>
        <ul>
            {data.map((group) => (
                <GroupsCard 
                    key={group.id}
                    group={group}
                />
            ))}
        </ul>
        </div>
    </>
    )
}
