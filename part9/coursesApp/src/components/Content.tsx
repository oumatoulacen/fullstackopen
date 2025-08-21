import { type CoursePart } from '../types';

function Content({ courses }: { courses: CoursePart[] }) {
	if (!courses) return null;
	return (
		<div>
			{courses.map((course) => {
				switch (course.kind) {
					case 'basic':
						return (
							<div key={course.name}>
								<h3>
									{course.name}
									{course.exerciseCount}
								</h3>
								<i>{course.description}</i>
							</div>
						);
					case 'group':
						return (
							<div key={course.name}>
								<h3>
									{course.name}
									{course.exerciseCount}
								</h3>
								<p>Project Exercises: {course.groupProjectCount}</p>
							</div>
						);
					case 'background':
						return (
							<div key={course.name}>
								<h3>
									{course.name} {course.exerciseCount}
								</h3>
								<i>{course.description}</i>

								<p>Submit to {course.backgroundMaterial}</p>
							</div>
						);
					case 'special':
						return (
							<div key={course.name}>
								<h3>
									{course.name} {course.exerciseCount}
								</h3>
								<i>{course.description}</i>

								<p>Requirements: {course.requirements.join(', ')}</p>
							</div>
						);
					default:
						return null;
				}
			})}
		</div>
	);
}

export default Content;
