import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

interface FrequentlyAskedQuestionsProps {
	title: string;
	description: string;
	faqs: {
		question: string;
		answer: string;
	}[];
}

export function FrequentlyAskedQuestions(props: FrequentlyAskedQuestionsProps) {
	const firstGrid = props.faqs.slice(0, Math.ceil(props.faqs.length / 2));
	const secondGrid = props.faqs.slice(Math.ceil(props.faqs.length / 2), props.faqs.length);
	return (
		<section className="flex flex-col items-start md:items-center  gap-4 md:gap-8">
			<h2 className="w-full text-start md:text-center font-semibold text-2xl md:text-4xl lg:text-5xl max-w-[22ch]">
				{props.title}
			</h2>
			<p className="text-start text-base md:text-center md:text-lg text-muted-foreground max-w-[65ch]">
				{props.description}
			</p>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 container px-0 md:mt-8">
				<Accordion type="single" collapsible className="w-full">
					{firstGrid.map((faq, index) => (
						<AccordionItem
							key={index}
							className="text-start text-base md:text-lg "
							value={faq.question}
						>
							<AccordionTrigger className="text-start font-semibold">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="text-base md:text-lg text-start">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
				<Accordion type="single" collapsible className="w-full">
					{secondGrid.map((faq, index) => (
						<AccordionItem
							key={index}
							className="text-start  text-base md:text-lg"
							value={faq.question}
						>
							<AccordionTrigger className="text-start font-semibold">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="text-base md:text-lg text-start">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
