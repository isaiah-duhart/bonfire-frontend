import { useMutation } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import GroupQuestionCard from '../cards/GroupQuestionCard'
import { API_URL } from '../../config'
import GroupResponsePanel from './GroupResponsePanel'

export default function GroupQuestionPanel({ groupID }) {
	const { jwt } = useAuth()
	const [groupQuestions, setGroupQuestions] = useState(null)
	const [selectedQuestion, setSelectedQuestion] = useState(null)
	const [showAll, setShowAll] = useState(false)
	const [error, setError] = useState(null)

	const getGroupQuestionsMutation = useMutation({
		mutationFn: async ({ groupID }) => {
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
						group_id: groupID,
						date: today.toISOString().split('T')[0],
					}),
				})
			} else {
				response = await fetch(`${API_URL}/api/group-questions/${groupID}`, {
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
		getGroupQuestionsMutation.mutate({ groupID })
	}, [groupID, showAll])

	const changeShowAll = () => {
		console.log(`Changing showAll to ${!showAll}`)
		setShowAll(!showAll)
	}
	if (error) return <p>Error loading group questions {error.message}</p>

	if (!groupQuestions) return <p>Loading...</p>

	console.log(groupQuestions)

	return (
		<>
			<div className='question-container'>
				<h2>{showAll ? 'All ' : "Today's "}Group Questions!</h2>
				<ul>
					{groupQuestions.map((groupQuestion) => (
						<GroupQuestionCard
							key={groupQuestion.id}
							groupQuestion={groupQuestion}
							setSelectedQuestion={setSelectedQuestion}
						/>
					))}
				</ul>
				<button onClick={changeShowAll}>{showAll ? "Today's " : 'All '} Questions</button>
			</div>
			{selectedQuestion && (
				<GroupResponsePanel groupQuestion={selectedQuestion} />
			)}
		</>
	)
}
