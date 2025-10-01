import { Link } from "@tanstack/react-router"

export default function GroupQuestionCard({ groupQuestion }) {
    return <Link to={`/group-questions/${groupQuestion.id}?text=${encodeURIComponent(groupQuestion.question_text)}`}>{groupQuestion.question_text}</Link>
}