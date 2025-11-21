import '../../styles/dropdown.css'

export default function DropdownItem({ children, ...props }) {
	return (
		<li className='dropdown-item' {...props}>
			{children}
		</li>
	)
}
