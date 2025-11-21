import { useAuth } from '../../context/AuthContext'
import '../../styles/card.css'

export default function GroupResponseCard({ groupResponse }) {
  const { userID } = useAuth()
  const isOwnResponse = userID === groupResponse.author_id

  const formattedDate = new Date(groupResponse.created_at).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <li>
		<div className={'response-bubble ' + (isOwnResponse ? 'own-bubble' : 'other-bubble')}>
			<div className={'message ' + (isOwnResponse ? 'own-message' : 'other-message')}>
				{groupResponse.response}
			</div>
			<div className='metadata'>
				<div className='author'>{groupResponse.author}</div>
				<div className="timestamp">{formattedDate}</div>
			</div>
		</div>
    </li>
  )
}