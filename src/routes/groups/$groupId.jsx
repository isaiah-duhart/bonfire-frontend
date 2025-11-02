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

	const { jwt } = useAuth()
	const [groupQuestions, setGroupQuestions] = useState(null)
	const [showAll, setShowAll] = useState(false)
	const [error, setError] = useState(null)

	const getGroupQuestionsMutation = useMutation({
		mutationFn: async ({ groupId }) => {
			const today = new Date()
			let response

			if (!showAll) {
				response = await fetch(`${API_URL}/api/group-questions`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${jwt}`,
					},
					body: JSON.stringify({
						group_id: groupId,
						date: today.toISOString().split('T')[0],
					}),
				})
			} else {
				response = await fetch(`${API_URL}/api/group-questions/${groupId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${jwt}`,
					},
				})
			}

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
		},
	})

	useEffect(() => {
		getGroupQuestionsMutation.mutate({ groupId })
	}, [groupId, showAll])

	const changeShowAll = () => {
		console.log(`Changing showAll to ${!showAll}`)
		setShowAll(!showAll)
	}
	if (error) return <p>Error loading group questions {error.message}</p>

	if (!groupQuestions) return <p>Loading...</p>

	console.log(groupQuestions)

	return (
		<div>
			<h2>Group Questions!</h2>
			<ul>
				{groupQuestions.map((groupQuestion) => (
					<GroupQuestionCard
						key={groupQuestion.id}
						groupQuestion={groupQuestion}
					/>
				))}
			</ul>
			<button onClick={changeShowAll}>ALL QUESTIONS</button>
		</div>
	)
}
