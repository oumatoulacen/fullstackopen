import { type CourseType } from '../types';

function Content({ courses }: { courses: CourseType[] }) {
	if (!courses) return null;
	return (
		<div>
			{courses.map((course) => (
				<p key={course.name}>
					{course.name} {course.exerciseCount}
				</p>
			))}
		</div>
	);
}

export default Content;
