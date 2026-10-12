import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';

type FaqsCardProps = {
  id: number;
  title: string;
  item: { id: string; question: string; answer: string }[];
};

export function FaqsCard({ id, title, item }: FaqsCardProps) {
  return (
    <div>
      <h3 className="text-primary border-accent mb-6 w-full border-b pb-2 text-2xl/8 font-medium">
        {title}
      </h3>

      <Accordion defaultValue={[`item-${id}`]} className="gap-y-4.5">
        {item.map((faq) => (
          <AccordionItem value={faq.id} key={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent className="whitespace-pre-line">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
