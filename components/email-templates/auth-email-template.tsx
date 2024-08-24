import * as React from 'react';

interface AuthEmailTemplateProps {
	title: string;
	description: React.ReactNode;
}

export const AuthEmailTemplate = (props: AuthEmailTemplateProps) => (
	<div>
		<h1>{props.title}</h1>
		{props.description}
	</div>
);
