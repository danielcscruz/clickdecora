"use client";

import { useEffect } from "react";

interface Props {
  url: string;
  protocol: string;
}

export function CalendlyEmbed({ url, protocol }: Props) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  if (!url) {
    return (
      <div className="bg-surface-alt border border-gold/20 rounded-sm p-8 text-center">
        <p className="font-body text-sm text-dark/50">
          Agendamento não configurado. Configure CALENDLY_URL no ambiente.
        </p>
      </div>
    );
  }

  const embedUrl = `${url}?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=6B0F1A&utm_campaign=${protocol}`;

  return (
    <div
      className="calendly-inline-widget"
      data-url={embedUrl}
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
