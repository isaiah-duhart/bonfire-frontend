import { useAuth } from '../../context/AuthContext'

import '../../styles/card.css'

export default function GroupQuestionCard({
	groupQuestion,
	setSelectedQuestion,
}) {
	const { userID } = useAuth()
	const isOwnQuestion = userID === groupQuestion.created_by

	return (
		<li
			className={isOwnQuestion ? 'own' : 'other'}
			onClick={() => setSelectedQuestion(groupQuestion)}
		>
			{groupQuestion.question_text}
		</li>
	)
}
