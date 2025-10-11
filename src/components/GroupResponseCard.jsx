import '../styles/groupResponseCard.css'
import {useAuth} from '../context/AuthContext'


export default function GroupResponseCard({groupResponse}){
    const { userID } = useAuth()
    const isOwnResponse = userID === groupResponse.author_id
    return (
        <li className={isOwnResponse ? 'own-response' : 'other-response'}>{groupResponse.author}: {groupResponse.response} {groupResponse.created_at}</li>
    )
}