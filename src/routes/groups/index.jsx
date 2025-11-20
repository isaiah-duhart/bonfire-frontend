import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { API_URL } from '../../config'
import { useEffect, useState } from 'react'

import '../../styles/groupsPage.css'
import GroupQuestionPanel from '../../components/panels/GroupQuestionPanel'
import Dropdown from '../../components/dropdown/Dropdown'
import DropdownButton from '../../components/dropdown/DropdownButton'
import DropdownContent from '../../components/dropdown/DropdownContent'
import DropdownList from '../../components/dropdown/DropdownList'
import DropdownItem from '../../components/dropdown/DropdownItem'

export const Route = createFileRoute('/groups/')({
	component: GroupsPage,
})

function GroupsPage() {
	const { jwt } = useAuth()
	const [groupID, setGroupID] = useState(null)
	const [showModal, setShowModal] = useState(false)
	const [createGroupError, setCreateGroupError] = useState(null)
	const queryClient = useQueryClient()

	const { data, isPending, error } = useQuery({
		queryKey: ['groups'],
		queryFn: async () => {
			const response = await fetch(`${API_URL}/api/groups`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${jwt}` },
			})
			if (!response.ok) {
				throw new Error('Failed to fetch groups')
			}
			return response.json()
		},
	})

	const createGroupMutation = useMutation({
		mutationFn: async ({ group_name, member_emails }) => {
			console.log(JSON.stringify({ group_name, member_emails }))
			console.log(jwt)
			const response = await fetch(`${API_URL}/api/groups`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${jwt}`,
				},
				body: JSON.stringify({ group_name, member_emails }),
			})

			if (!response.ok) setCreateGroupError(response.body)

			const json = await response.json()
			console.log(json)
			return json
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
		onError: (error) => setCreateGroupError(error),
	})

	useEffect(() => {
		if (data && data.length > 0) {
			setGroupID(data[0].group_id)
		}
	}, [data])

	const handleCreateGroup = async (e) => {
		e.preventDefault()
		setCreateGroupError(null)
		const formData = new FormData(e.target)
		createGroupMutation.mutate({
			group_name: formData.get('group_name'),
			member_emails: formData.get('member_emails').split(', '),
		})
	}

	if (isPending) return <p>Loading groups...</p>
	if (error) return <p>Error: {error.message}</p>
	if (createGroupError)
		return <p>Error creating group: {createGroupError.message}</p>

	return (
		<>
			<header className='header'>
				<div className='title'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width={30}
						height={30}
						fill='currentColor'
						viewBox='9 9 25 22'
					>
						<image href='../../../public/bonfire.svg' />
					</svg>
					<span>Bonfire</span>
				</div>

				<div className='groups-dropdown'>
					<Dropdown>
						<DropdownButton>Groups</DropdownButton>
						<DropdownContent>
							<DropdownList>
								{data.map((group) => (
									<DropdownItem
										key={group.id}
										onClick={() => setGroupID(group.group_id)}
									>
										{group.group_name}
									</DropdownItem>
								))}
								<DropdownItem onClick={() => setShowModal(true)}>
									Create Group
								</DropdownItem>
							</DropdownList>
						</DropdownContent>
					</Dropdown>
				</div>
			</header>
			<div className='page-container'>
				{groupID && <GroupQuestionPanel groupID={groupID} />}
			</div>
			{showModal && (
				<form onSubmit={handleCreateGroup}>
					<input
						type='text'
						placeholder='Group Name'
						name='group_name'
						required
					/>
					<input
						type='text'
						placeholder="Group Members' Emails"
						name='member_emails'
						required
					/>
					<button type='submit'>Submit</button>
					<button type='button' onClick={() => setShowModal(false)}>
						Cancel
					</button>
				</form>
			)}
		</>
	)
}
