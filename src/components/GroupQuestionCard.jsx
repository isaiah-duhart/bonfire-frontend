import { Link } from "@tanstack/react-router"
import { useAuth } from "../context/AuthContext"

import '../styles/groupQuestionsCard.css'

export default function GroupQuestionCard({ groupQuestion }) {
    const { userID } = useAuth()
    const isOwnQuestion = userID === groupQuestion.created_by
    return <Link className={isOwnQuestion ? 'own-question' : 'other-question'} to={`/group-questions/${groupQuestion.id}?text=${encodeURIComponent(groupQuestion.question_text)}`}>{groupQuestion.question_text}</Link>
}