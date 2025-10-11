import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { API_URL } from '../../config'
import GroupsCard from '../../components/GroupsCard'
import { useState } from 'react'

import '../../styles/selection.css'

export const Route = createFileRoute('/groups/')({
	component: GroupsPage,
})

function GroupsPage() {
    const { jwt } = useAuth()
    const [showModal, setShowModal] = useState(false)
    const [createGroupError, setCreateGroupError] = useState(null)
    const queryClient = useQueryClient()

    const { data, isPending, error } = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
        const response = await fetch(`/api/groups`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${jwt}`}
        })
        if (!response.ok) {
            throw new Error('Failed to fetch groups')
        }
        return response.json()
        },
    })

    const createGroupMutation = useMutation({
        mutationFn: async ({ group_name, member_emails }) => {
            console.log(JSON.stringify({group_name, member_emails}))
            console.log(jwt)
            const response = await fetch(`/api/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                body: JSON.stringify({group_name, member_emails})
            })

            if (!response.ok) setCreateGroupError(response.body)

            const json = await response.json()
            console.log(json)
            return json
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['groups']}),
        onError: (error) => setCreateGroupError(error)
    })

    const handleCreateGroup = async (e) => {
        e.preventDefault()
        setCreateGroupError(null)
        const formData = new FormData(e.target)
        createGroupMutation.mutate({
            group_name: formData.get("group_name"),
            member_emails: formData.get("member_emails").split(", "),
        })
    }

    if (isPending) return <p>Loading groups...</p>
    if (error) return <p>Error: {error.message}</p>
    if (createGroupError) return <p>Error creating group: {createGroupError.message}</p>

    return (
    <>
        <div className='selection-body'>
        <h2>Your Groups</h2>
        <ul>
            {data.map((group) => (
                <li key={group.id}>
                    <GroupsCard 
                        group={group}
                    />
                </li>
            ))}
        </ul>
        <button onClick={() => setShowModal(true)}>CREATE GROUP</button>
        </div>
        {showModal && (
            <form onSubmit={handleCreateGroup}>
                <input type="text" placeholder="Group Name" name="group_name" required />
                <input type="text" placeholder="Group Members' Emails" name="member_emails" required />
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
        )}
    </>
    )
}
