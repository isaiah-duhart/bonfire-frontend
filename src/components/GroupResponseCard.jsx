import {useAuth} from '../context/AuthContext'

import '../styles/card.css'

export default function GroupResponseCard({groupResponse}){
    const { userID } = useAuth()
    const isOwnResponse = userID === groupResponse.author_id
    return (
        <li className={isOwnResponse ? 'own' : 'other'}>{groupResponse.author}: {groupResponse.response} {groupResponse.created_at}</li>
    )
}