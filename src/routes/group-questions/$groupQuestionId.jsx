import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { API_URL } from '../../config'
import { useAuth } from '../../context/AuthContext'
import GroupResponseCard from '../../components/GroupResponseCard'

import '../../styles/groupResponsePage.css'

export const Route = createFileRoute('/group-questions/$groupQuestionId')({
	component: GroupQuestionPage,
})

function GroupQuestionPage() {
	const [responseText, setResponseText] = useState('')
	const { jwt } = useAuth()
	const { groupQuestionId } = Route.useParams()
	const questionText = Route.useSearch({ select: (search) => search.text })
	const queryClient = useQueryClient()

	const { data, isPending, error } = useQuery({
		queryKey: ['group-responses'],
		queryFn: async () => {
			const response = await fetch(
				`${API_URL}/api/group-responses/${groupQuestionId}`,
				{
					method: 'GET',
					headers: { Authorization: `Bearer ${jwt}` },
				}
			)

			if (!response.ok) {
				throw new Error(response.body)
			}
			return response.json()
		},
	})

	const submitResponseMutation = useMutation({
		mutationFn: async ({ groupQuestionId, responseText }) => {
			const response = await fetch(`${API_URL}/api/group-responses`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${jwt}`,
				},
				body: JSON.stringify({
					group_question_id: groupQuestionId,
					response: responseText,
				}),
			})

			if (!response.ok) {
				throw new Error(response.body)
			}
			return response.json
		},
		onSuccess: () => {
			setResponseText('')
			queryClient.invalidateQueries({ queryKey: ['group-responses'] })
		},
	})

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && responseText.trim()) {
			e.preventDefault()
			submitResponseMutation.mutate({ groupQuestionId, responseText })
		}
	}

	if (error) return <p>Error fetching group responses {error.message}</p>
	if (isPending) return <p>Loading...</p>

	return (
		<>
			<h1>{questionText}</h1>
			<ul>
				{data.map((groupResponse) => (
					<GroupResponseCard
						key={groupResponse.id}
						groupResponse={groupResponse}
					/>
				))}
			</ul>
			<input
				type='text'
				value={responseText}
				onChange={(e) => setResponseText(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder='Type your response and press Enter'
				style={{ width: '100%', padding: '8px' }}
			/>
			<button
				onClick={() =>
					queryClient.invalidateQueries({ queryKey: ['group-responses'] })
				}
			>
				REFRESH
			</button>
		</>
	)
}
