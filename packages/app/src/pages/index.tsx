import { Navbar } from '@pitch/components/Navbar';
import {
	mapYamlToSlides,
	SlidePreview,
} from '@pitch/components/SlidePreview/SlidePreview';
import { Toast, useToast } from '@pitch/components/Toast';
import { labToHex } from '@pitch/utils/colors';
import { applyExportSafeColors } from '@pitch/utils/dom';
import { logger } from '@pitch/utils/logger';
import { validate } from '@pitch/utils/yaml';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import yaml from 'yaml';

const CONTENT = `title:
  product: InvoiceMate
  tagline: Simple invoicing for indie founders
  audience: Indie founders & freelancers

problem:
  - Creating invoices is slow and repetitive
  - Existing tools are bloated and expensive

solution:
  description: A lightweight invoice generator that connects to Stripe and exports PDFs in one click.

product:
  features:
    - Create invoices in under 30 seconds
    - Stripe sync
    - Clean professional templates

businessModel:
  pricing: $9/month
  model: Subscription SaaS
`;

const getInitialInput = () => {
	if (typeof window === 'undefined') return CONTENT;
	const yamlParam = new URLSearchParams(location.search).get('yaml');
	return yamlParam ? decodeURIComponent(yamlParam) : CONTENT;
};

const HomePage: NextPage = () => {
	const { toasts, show, dismiss } = useToast();

	const [{ input }, setState] = useState<{ input: string }>({
		input: getInitialInput(),
	});

	// Sync YAML → URL (shareable link)
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const encoded = encodeURIComponent(input);
		if (encoded.length > 4000) {
			logger.warn('YAML too long for URL 🚧', encoded.length);
			return;
		}

		const url = `${location.pathname}?yaml=${encoded}`;
		window.history.replaceState(null, '', url);

		logger.info('URL synced 🔄', encoded.length);
	}, [input]);

	const parsed = useMemo(() => {
		try {
			logger.info('Parsing YAML ✍️');
			const result = yaml.parse(input);
			const errors = validate(result);

			if (errors.length > 0) {
				logger.warn('YAML validation errors 🧪', errors);
			} else {
				logger.success('YAML valid ✅');
			}

			return { data: result, errors: validate(result) };
		} catch (error) {
			logger.error('YAML parsing failed 💥', error);
			return { data: null, errors: [{ path: '', message: 'Invalid YAML' }] };
		}
	}, [input]);

	const slides = useMemo(
		() => (parsed.data ? mapYamlToSlides(parsed.data) : []),
		[parsed.data]
	);

	const exportPDF = async () => {
		logger.info('PDF export requested 📄');

		if (!parsed.data || parsed.errors.length > 0) {
			logger.warn('PDF export blocked — YAML errors 🧯', parsed.errors);
			show('error', 'Fix YAML errors before exporting');
			return;
		}

		const loadingId = show('loading', 'Generating PDF…');

		try {
			const preview = document.getElementById('pitch-preview');
			if (!preview) throw new Error('#pitch-preview not found');

			// Clone preview for export
			const exportContainer = preview.cloneNode(true) as HTMLElement;
			exportContainer.style.position = 'fixed';
			exportContainer.style.top = '-9999px';
			exportContainer.style.left = '-9999px';
			exportContainer.style.width = '100%';
			exportContainer.style.height = '100%';
			document.body.appendChild(exportContainer);

			const originalHtmlBg = getComputedStyle(
				document.documentElement
			).backgroundColor;
			const originalBodyBg = getComputedStyle(document.body).backgroundColor;

			// Force export-safe backgrounds
			document.documentElement.style.backgroundColor = originalHtmlBg.includes(
				'lab('
			)
				? labToHex(originalHtmlBg)
				: originalHtmlBg; // fallback hex / rgb
			document.body.style.backgroundColor = originalBodyBg.includes('lab(')
				? labToHex(originalBodyBg)
				: originalBodyBg; // fallback hex / rgb

			// Apply export-safe colors to clone
			const restoreColors = applyExportSafeColors(exportContainer);

			const slides = Array.from(
				exportContainer.querySelectorAll<HTMLElement>('.aspect-video')
			);

			if (slides.length === 0)
				throw new Error('No slides found inside preview');

			logger.info('Rendering slides 🖼️', { count: slides.length });

			const pdf = new jsPDF({
				orientation: 'landscape',
				unit: 'px',
				format: [1280, 720],
			});

			for (let i = 0; i < slides.length; i++) {
				const slide = slides[i];

				const canvas = await html2canvas(slide, {
					scale: 2,
					useCORS: true,
					backgroundColor: null,
					width: 1280,
					height: 720,
					windowWidth: 1280,
					windowHeight: 720,
				});

				const imgData = canvas.toDataURL('image/png');

				if (i > 0) pdf.addPage();
				pdf.addImage(imgData, 'PNG', 0, 0, 1280, 720);
			}

			// Cleanup
			restoreColors();
			document.body.removeChild(exportContainer);

			pdf.save(`${parsed.data.title.product}.pdf`);

			logger.success('PDF exported 🎉', parsed.data.title.product);
			show('success', 'PDF exported successfully');
		} catch (err) {
			logger.error('PDF export failed ❌', err);
			show('error', 'PDF export failed');
		} finally {
			dismiss(loadingId);
		}
	};

	const shareURL = () => {
		logger.info('Share link requested 🔗');

		const encoded = encodeURIComponent(input);
		const url = `${location.origin}?yaml=${encoded}`;

		navigator.clipboard.writeText(url);

		logger.success('Shareable link copied 📋', { length: encoded.length });
		show('success', 'Shareable link copied');
	};

	return (
		<>
			{toasts && <Toast toasts={toasts} onDismiss={dismiss} />}
			<div className="bg-base-200 flex h-screen w-screen flex-col overflow-hidden">
				<Navbar />
				<div className="h-full grow">
					<div className="divide-base-300 grid h-full w-full grid-cols-2 divide-x">
						{/* YAML input */}
						<div className="col-span-1">
							<textarea
								id="input"
								name="input"
								placeholder="Input YAML"
								className="bg-base-100 h-full w-full p-8 font-mono text-sm focus:outline-none"
								value={input}
								onChange={(event) => {
									setState({ input: event.target.value });
								}}
							/>
						</div>

						{/* Slides preview */}
						<div className="col-span-1 overflow-hidden">
							<div className="h-full w-full overflow-auto p-8">
								<div className="flex flex-col gap-y-8">
									<div className="flex justify-end gap-x-8">
										<button className="btn btn-accent" onClick={shareURL}>
											🔗 Copy Shareable Link
										</button>

										<button
											className="btn btn-primary"
											disabled={!parsed.data || parsed.errors.length > 0}
											onClick={exportPDF}>
											📄 Export PDF
										</button>
									</div>

									{!parsed && (
										<div className="alert alert-error">Invalid YAML</div>
									)}

									{parsed && (
										<>
											{parsed.errors.length > 0 && (
												<div className="alert alert-error">
													<ul className="list-disc space-y-1 pl-4 text-sm">
														{parsed.errors.map((e, i) => (
															<li key={i}>
																<strong>{e.path || 'YAML'}:</strong> {e.message}
																{e.hint && (
																	<span className="opacity-70">
																		{' '}
																		— {e.hint}
																	</span>
																)}
															</li>
														))}
													</ul>
												</div>
											)}

											<div id="pitch-preview" className="flex flex-col gap-8">
												{slides.map((slide, i) => (
													<SlidePreview
														key={slide.kicker}
														index={i}
														slide={slide}
													/>
												))}
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;
