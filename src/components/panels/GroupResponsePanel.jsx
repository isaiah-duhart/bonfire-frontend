import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { API_URL } from '../../config'
import { useAuth } from '../../context/AuthContext'
import GroupResponseCard from '../cards/GroupResponseCard'

export default function GroupResponsePanel({ groupQuestion }) {
	const { jwt } = useAuth()
	const [responseText, setResponseText] = useState('')
	const queryClient = useQueryClient()

	const { data, isPending, error } = useQuery({
		queryKey: ['group-responses'],
		queryFn: async () => {
			console.log(`fetching form ${API_URL}/api/group-responses/${groupQuestion.id}`)
			const response = await fetch(
				`${API_URL}/api/group-responses/${groupQuestion.id}`,
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
		mutationFn: async ({ groupQuestion, responseText }) => {
			const response = await fetch(`${API_URL}/api/group-responses`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${jwt}`,
				},
				body: JSON.stringify({
					group_question_id: groupQuestion.id,
					response: responseText,
				}),
			})

			if (!response.ok) {
				throw new Error(response.body)
			}
			return response.json()
		},
		onSuccess: () => {
			setResponseText('')
			queryClient.invalidateQueries({ queryKey: ['group-responses'] })
		},
	})

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ['group-responses'] })
	}, [groupQuestion])

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && responseText.trim()) {
			e.preventDefault()
			submitResponseMutation.mutate({ groupQuestion, responseText })
		}
	}

	if (error) return <p>Error fetching group responses {error.message}</p>
	if (isPending) return <p>Loading...</p>

	console.log(data)

	return (
		<div className='response-container'>
			<h1>{groupQuestion.question_text}</h1>
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
				placeholder='Type your respons e and press Enter'
			/>
			<button
				onClick={() =>
					queryClient.invalidateQueries({ queryKey: ['group-responses'] })
				}
			>
				Refresh
			</button>
		</div>
	)
}
