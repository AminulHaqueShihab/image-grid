import { useState } from 'react';
import './users.css';
import { data } from './data';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	arrayMove,
	hasSortableData,
	horizontalListSortingStrategy,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS, hasViewportRelativeCoordinates } from '@dnd-kit/utilities';
import {
	Box,
	Button,
	Checkbox,
	Flex,
	Grid,
	GridItem,
	Heading,
	Image,
	Input,
	Text,
} from '@chakra-ui/react';
import { BsImage } from 'react-icons/bs';

// const SortableUser = ({ user }) => {
// 	const { attributes, listeners, setNodeRef, transform, transition } =
// 		useSortable({ id: user.id });
// 	const style = {
// 		transition,
// 		transform: CSS.Transform.toString(transform),
// 	};

// 	return (
// 		<div
// 			ref={setNodeRef}
// 			style={style}
// 			{...attributes}
// 			{...listeners}
// 			className='user'
// 		>
// 			{user.name}
// 		</div>
// 	);
// };

const ImageCard = ({ user, ...props }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: user.id });
	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};
	return (
		<GridItem
			borderRadius='6px'
			border='1px solid'
			borderColor='gray.400'
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			{...props}
			position='relative'
			_hover={{
				'&::after': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: '#000', // Transparent black overlay
					opacity: 0.2, // Initially invisible
					transition: 'opacity 0.3s', // Smooth transition on hover
					zIndex: '1', // Place overlay above content
				},
			}}
			_hoverAfter={{
				opacity: 1, // Make the overlay visible on hover
			}}
		>
			<Checkbox
				colorScheme='blue'
				position='absolute'
				top='10px'
				left='10px'
				size='lg'
				borderRadius='6px'
				zIndex='2' // Make sure the checkbox is above the overlay
			></Checkbox>
			<Image src={user.image} objectFit='cover' />
		</GridItem>
	);
};

const Users = () => {
	const [users, setUsers] = useState(data);
	const [inputValue, setInputValue] = useState('');
	const addUser = () => {
		newUser = {
			id: Date.now().toString(),
			name: inputValue,
		};
		setInputValue('');
		setUsers(users => [...users, newUser]);
	};

	const onDragEnd = event => {
		const { active, over } = event;
		if (active.id === over.id) {
			return;
		}
		setUsers(users => {
			const oldIndex = users.findIndex(user => user.id === active.id);
			const newIndex = users.findIndex(user => user.id === over.id);
			return arrayMove(users, oldIndex, newIndex);
		});
	};

	return (
		<Flex
			direction='column'
			w='60%'
			justifyContent='center'
			alignItems='center'
			flexWrap='wrap'
			mx='auto'
			py='100px'
			minH='100vh'
			gap='15px'
		>
			<Flex w='full' justify='space-between' px='20px'>
				<Heading>All Files</Heading>
				<Button colorScheme='red'>Delete</Button>
			</Flex>
			<Grid
				templateColumns='1fr 1fr 1fr 1fr 1fr'
				templateRows='1fr 1fr 1fr'
				gap='20px'
				p='20px'
			>
				<DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
					<SortableContext
						items={users}
						strategy={horizontalListSortingStrategy}
					>
						{users.map((user, index) => (
							<>
								<ImageCard
									colSpan={index === 0 ? 2 : 1}
									rowSpan={index === 0 ? 2 : 1}
									key={user.id}
									user={user}
								/>
							</>

							// <SortableUser key={user.id} user={user} />
						))}
						<GridItem
							borderRadius='6px'
							border='1px solid'
							borderColor='gray.400'
							justifyContent='center'
							alignItems='center'
							cursor='pointer'
							userSelect='none'
						>
							<Flex
								direction={'column'}
								justifyContent='center'
								alignItems='center'
								h='100%'
								gap='10px'
							>
								<BsImage />
								<Text>Add Images</Text>
							</Flex>
						</GridItem>
					</SortableContext>
				</DndContext>
			</Grid>
		</Flex>
	);
};
export default Users;
