import { PitchDeck, SlideLayout } from '@pitch/types/pitch.types';
import { FC } from 'react';

export const mapYamlToSlides = (data: PitchDeck): SlideLayout[] => [
	{
		kicker: 'Introduction',
		title: data.title.product,
		blocks: [
			{ type: 'subtitle', text: data.title.tagline },
			{ type: 'text', text: data.title.audience },
		],
	},
	{
		kicker: 'Problem',
		title: 'Problem',
		blocks: [{ type: 'bullets', items: data.problem }],
	},
	{
		kicker: 'Solution',
		title: 'Solution',
		blocks: [{ type: 'text', text: data.solution.description }],
	},
	{
		kicker: 'Product',
		title: 'Product',
		blocks: [{ type: 'bullets', items: data.product.features }],
	},
	{
		kicker: 'Business Model',
		title: 'Pricing',
		blocks: [
			{
				type: 'highlight',
				text: `${data.pricing.symbol}${data.pricing.amount}`,
				subtext: `${data.pricing.frequency}`,
			},
		],
	},
];

export const SlidePreview: FC<{ slide: SlideLayout; index: number }> = ({
	slide,
	index,
}) => {
	return (
		<div className="group bg-base-100 border-base-100 relative aspect-video h-[720px] w-[1280px] cursor-default border p-14 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
			{/* hover gradient overlay */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500 to-transparent opacity-0 transition-opacity group-hover:opacity-20" />

			{/* slide index */}
			<div className="absolute top-6 right-6 font-mono text-xs text-neutral-400">
				{index + 1} / 5
			</div>

			{/* kicker */}
			{slide.kicker && (
				<div className="mb-4 text-xs font-semibold text-purple-400 uppercase">
					<pre className="m-0 inline pb-4 break-words whitespace-pre-wrap">
						{slide.kicker}
					</pre>
				</div>
			)}

			{/* deck title */}
			{slide.title && (
				<div className="mb-4 text-4xl font-bold text-white">
					<pre className="m-0 inline pb-4 break-words whitespace-pre-wrap">
						{slide.title}
					</pre>
				</div>
			)}

			<div className="flex flex-col">
				{slide.blocks.map((b, i) => {
					switch (b.type) {
						case 'title':
							return (
								<div key={i} className="mb-4 text-4xl font-bold text-white">
									<pre className="m-0 inline pb-4 break-words whitespace-pre-wrap">
										{b.text}
									</pre>
								</div>
							);

						case 'subtitle':
							return (
								<div
									key={i}
									className="mb-4 text-2xl font-medium text-neutral-300">
									<pre className="m-0 inline pb-4 break-words whitespace-pre-wrap">
										{b.text}
									</pre>
								</div>
							);

						case 'text':
							return (
								<div key={i} className="mb-4 text-lg text-neutral-400">
									<pre className="m-0 pb-4 break-words whitespace-pre-wrap">
										{b.text}
									</pre>
								</div>
							);

						case 'bullets':
							return (
								<ul className="list-inside list-disc space-y-2 pl-6 text-neutral-200 marker:text-purple-400">
									{b.items.map((item, j) => (
										<li key={j}>
											<pre className="m-0 inline pb-4 break-words whitespace-pre-wrap">
												{item}
											</pre>
										</li>
									))}
								</ul>
							);

						case 'highlight':
							return (
								<div key={i} className="flex items-start gap-6 pb-6">
									{/* big number */}
									<div className="flex-shrink-0 text-purple-400">
										<span className="text-5xl font-extrabold">{b.text}</span>
										<span className="text-3xl">/</span>
										<span className="text-xl">{b.subtext}</span>
									</div>
								</div>
							);
					}
				})}
			</div>
		</div>
	);
};
