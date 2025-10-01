import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import GroupQuestionCard from '../../components/GroupQuestionCard'
import { API_URL } from '../../config'

export const Route = createFileRoute('/groups/$groupId')({
	component: GroupDetailPage,
})

function GroupDetailPage() {
    const { groupId } = Route.useParams()
    console.log('Params:', groupId)

    const { jwt } = useAuth()
    const [groupQuestions, setGroupQuestions] = useState(null)
    const [error, setError] = useState(null)

    const getGroupQuestionsMutation = useMutation({
    mutationFn: async ({groupId}) => {
        const today = new Date()
        
        const response = await fetch(`${API_URL}/api/group-questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({"group_id": groupId, "date": today.toISOString().split('T')[0]})
        })
        if (!response.ok) {
            throw new Error('Fetch group questions failed')
        }
        return response.json()
    },
    onSuccess: (data) => {
        setGroupQuestions(data)
    },
    onError: (error) => {
        setError(error)
    }
    })

    useEffect(() => {
        getGroupQuestionsMutation.mutate({groupId})
    }, [groupId])
    

    if (error) return <p>Error loading group questions {error.message}</p>

    if (!groupQuestions) return <p>Loading...</p>

    console.log(groupQuestions)

    return (
        <div>
        <h2>Group Questions Today!</h2>
        <ul> 
            {groupQuestions.map((groupQuestion) => (
                <GroupQuestionCard 
                    key={groupQuestion.id}
                    groupQuestion={groupQuestion}
                />
            ))}
        </ul>
        </div>
    )
}
