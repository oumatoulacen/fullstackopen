const Notify = ({ notification }) => {
	if (!notification) {
		return null;
	}

	return (
		<div
			style={{
				color: notification.type === 'error' ? 'red' : 'green',
				backgroundColor: 'lightgrey',
				padding: '10px',
				borderRadius: '5px',
			}}
		>
			{notification.message}
		</div>
	);
};

export default Notify;
