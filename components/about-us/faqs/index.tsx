import { FaqsCard } from './FaqsCard';
import { FAQ_ITEMS } from '../../constants/faqs';

export function FAQs() {
  return (
    <section className="px-section py-16" id="faqs">
      <h2 className="text-center text-5xl/15 font-medium tracking-[-0.02em]">
        Frequently Asked Questions
      </h2>
      <p className="mt-6 mb-16 text-center text-xl/7 font-normal">
        Find answers to common questions about ULES
      </p>
      <div className="space-y-12 pt-22">
        {FAQ_ITEMS.map((faqItem) => (
          <FaqsCard key={faqItem.id} {...faqItem} />
        ))}
      </div>
    </section>
  );
}
