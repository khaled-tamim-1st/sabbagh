import React from 'react';

/**
 * أنواع وبيانات Schema.org لـ GEO (Generative Engine Optimization)
 * محركات البحث التوليدية: Google AI Overviews, Perplexity, ChatGPT Search
 */

export interface BaseSchemaProps {
  id?: string;
}

export interface LocalBusinessSchemaProps extends BaseSchemaProps {
  name: string;
  type?: 'HomeAndConstructionBusiness' | 'LocalBusiness' | 'ProfessionalService';
  description?: string;
  url?: string;
  telephone?: string;
  whatsapp?: string;
  image?: string;
  priceRange?: string; // e.g. "18 - 150 KWD"
  addressLocality?: string; // e.g. "السالمية", "حولي", "مدينة الكويت"
  addressRegion?: string; // e.g. "حولي", "العاصمة", "الكويت"
  streetAddress?: string;
  postalCode?: string;
  addressCountry?: string; // default "KW"
  latitude?: number;
  longitude?: number;
  areaServed?: string | string[];
  ratingValue?: number | string;
  reviewCount?: number;
  services?: string[];
  currenciesAccepted?: string;
  paymentAccepted?: string;
  openingHours?: string[];
  alternateName?: string[];
  brand?: {
    name: string;
    alternateName?: string;
  };
}

export interface FaqItemSchema {
  question: string;
  answer: string;
}

export interface FaqSchemaProps extends BaseSchemaProps {
  items: FaqItemSchema[];
}

export interface BreadcrumbItemSchema {
  name: string;
  url: string;
}

export interface BreadcrumbSchemaProps extends BaseSchemaProps {
  items: BreadcrumbItemSchema[];
}

export interface ServiceSchemaProps extends BaseSchemaProps {
  name: string;
  serviceType?: string;
  description: string;
  category?: string;
  providerName?: string;
  providerUrl?: string;
  areaServed?: string | string[];
  price?: number | string;
  priceCurrency?: string;
  priceUnit?: string;
  url?: string;
}

/**
 * مولد كائن Schema لـ LocalBusiness / HomeAndConstructionBusiness
 */
export function generateLocalBusinessSchema(props: LocalBusinessSchemaProps) {
  const domain = 'https://sabbagh-kuwait.com';
  const url = props.url?.startsWith('http') ? props.url : `${domain}${props.url || ''}`;
  const imageUrl = props.image?.startsWith('http') ? props.image : `${domain}${props.image || '/logo.png'}`;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': props.type || 'HomeAndConstructionBusiness',
    name: props.name,
    description: props.description || 'خدمات أصباغ ودهانات وتشطيبات وديكورات المنازل والفلل في دولة الكويت.',
    url,
    image: imageUrl,
    logo: `${domain}/logo.png`,
    priceRange: props.priceRange || '18 - 150 KWD',
    currenciesAccepted: props.currenciesAccepted || 'KWD',
    paymentAccepted: props.paymentAccepted || 'Cash, KNET, Electronic Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: props.addressLocality || 'مدينة الكويت',
      addressRegion: props.addressRegion || 'الكويت',
      addressCountry: props.addressCountry || 'KW',
      ...(props.streetAddress ? { streetAddress: props.streetAddress } : {}),
      ...(props.postalCode ? { postalCode: props.postalCode } : {}),
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: props.latitude || 29.3759,
      longitude: props.longitude || 47.9774,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '07:00',
        closes: '22:00',
      },
    ],
  };

  if (props.telephone) {
    schema.telephone = props.telephone;
  }

  // دعم الواتساب كرابط تواصل سريع
  if (props.whatsapp) {
    schema.sameAs = [
      `https://wa.me/${props.whatsapp.replace(/\D/g, '')}`,
    ];
  }

  if (props.areaServed) {
    if (Array.isArray(props.areaServed)) {
      schema.areaServed = props.areaServed.map((area) => ({
        '@type': 'AdministrativeArea',
        name: area,
      }));
    } else {
      schema.areaServed = {
        '@type': 'AdministrativeArea',
        name: props.areaServed,
      };
    }
  } else {
    schema.areaServed = {
      '@type': 'Country',
      name: 'Kuwait',
      alternateName: 'دولة الكويت',
    };
  }

  if (props.ratingValue && props.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: typeof props.ratingValue === 'string' ? parseFloat(props.ratingValue) : props.ratingValue,
      reviewCount: props.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (props.services && props.services.length > 0) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `خدمات ${props.name}`,
      itemListElement: props.services.map((srv, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: srv,
        },
        position: idx + 1,
      })),
    };
  }

  if (props.alternateName && props.alternateName.length > 0) {
    schema.alternateName = props.alternateName;
  }

  if (props.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: props.brand.name,
      ...(props.brand.alternateName ? { alternateName: props.brand.alternateName } : {}),
    };
  }

  return schema;
}

/**
 * مولد كائن Schema لـ FAQPage
 */
export function generateFaqSchema(props: FaqSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: props.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * مولد كائن Schema لـ BreadcrumbList
 */
export function generateBreadcrumbSchema(props: BreadcrumbSchemaProps) {
  const domain = 'https://sabbagh-kuwait.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: props.items.map((item, index) => {
      const fullUrl = item.url.startsWith('http') ? item.url : `${domain}${item.url}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: fullUrl,
      };
    }),
  };
}

/**
 * مولد كائن Schema لـ Service
 */
export function generateServiceSchema(props: ServiceSchemaProps) {
  const domain = 'https://sabbagh-kuwait.com';
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: props.name,
    serviceType: props.serviceType || props.name,
    description: props.description,
    provider: {
      '@type': 'LocalBusiness',
      name: props.providerName || 'صباغ الكويت',
      url: props.providerUrl ? (props.providerUrl.startsWith('http') ? props.providerUrl : `${domain}${props.providerUrl}`) : domain,
    },
  };

  if (props.category) {
    schema.category = props.category;
  }

  if (props.url) {
    schema.url = props.url.startsWith('http') ? props.url : `${domain}${props.url}`;
  }

  if (props.areaServed) {
    schema.areaServed = Array.isArray(props.areaServed)
      ? props.areaServed.map((a) => ({ '@type': 'AdministrativeArea', name: a }))
      : { '@type': 'AdministrativeArea', name: props.areaServed };
  } else {
    schema.areaServed = {
      '@type': 'Country',
      name: 'Kuwait',
    };
  }

  if (props.price !== undefined) {
    schema.offers = {
      '@type': 'Offer',
      price: props.price,
      priceCurrency: props.priceCurrency || 'KWD',
      availability: 'https://schema.org/InStock',
      ...(props.priceUnit ? { description: props.priceUnit } : {}),
    };
  }

  return schema;
}

/**
 * المولد العام لدليل صباغ الكويت الرئيسي (المنصة ككل)
 */
export function generatePlatformSchema() {
  return generateLocalBusinessSchema({
    name: 'صباغ الكويت | فني الكويت المعتمد للأصباغ والديكورات',
    type: 'HomeAndConstructionBusiness',
    description: 'دليل صباغ الكويت الأول المعتمد من منصة فني الكويت: تواصل مباشر ومقارنة بين أمهر الصباغين وفنيي الدهانات الداخلية والخارجية والسيجما وبديل الرخام في كافة محافظات الكويت.',
    url: '/',
    image: '/logo.png',
    telephone: '+965 94412356',
    priceRange: '18 - 150 KWD',
    addressLocality: 'مدينة الكويت',
    addressRegion: 'العاصمة',
    addressCountry: 'KW',
    areaServed: [
      'محافظة العاصمة',
      'محافظة حولي',
      'محافظة الفروانية',
      'محافظة الأحمدي',
      'محافظة مبارك الكبير',
      'محافظة الجهراء',
      'مدينة المطلاع الجديدة',
      'مدينة صباح الأحمد السكنية',
      'شاليهات الخيران وبنيدر',
    ],
    ratingValue: 4.92,
    reviewCount: 345,
    services: [
      'أصباغ داخلية وجدران وأسقف (جوتن فينوماستيك وكابارول)',
      'أصباغ واجهات خارجية وسيجمات مقاومة للشمس والغبار (جوتاشيلد إكستريم)',
      'تركيب ورق جدران كوري وأوروبي ضد الرطوبة',
      'ديكورات بديل الرخام وبديل الخشب وبانوهات الفوم',
      'ترميم ومعالجة الرطوبة والشروخ وتمليح الطوفة',
      'أصباغ الأبواب الخشبية والحديدية لاكيه وناري وزيتي',
      'أرضيات إيبوكسي لمواقف السيارات والسراديب',
      'عوازل أسطح مائية وحرارية ومكافحة الخرير',
    ],
    alternateName: [
      'صباغ الكويت',
      'فني الكويت',
      'فني صباغ الكويت',
      'دليل فني الكويت',
      'Sabbagh Kuwait',
      'Fani Kuwait',
    ],
    brand: {
      name: 'فني الكويت',
      alternateName: 'صباغ الكويت',
    },
  });
}

/**
 * مكوّن React الموحد لحقن JSON-LD Script في الصفحة
 */
export function SeoSchema({
  schemas,
}: {
  schemas: Record<string, any> | Array<Record<string, any> | null | undefined>;
}) {
  const schemaList = Array.isArray(schemas)
    ? schemas.filter((s): s is Record<string, any> => Boolean(s))
    : [schemas];

  if (schemaList.length === 0) return null;

  return (
    <>
      {schemaList.map((schemaObj, index) => (
        <script
          key={`seo-schema-${index}-${schemaObj['@type'] || 'item'}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaObj, null, 2),
          }}
        />
      ))}
    </>
  );
}

/**
 * مكوّنات مخصصة جاهزة للاستخدام المباشر
 */
export function LocalBusinessSchema(props: LocalBusinessSchemaProps) {
  const schema = generateLocalBusinessSchema(props);
  return <SeoSchema schemas={schema} />;
}

export function FaqSchema(props: FaqSchemaProps) {
  const schema = generateFaqSchema(props);
  return <SeoSchema schemas={schema} />;
}

export function BreadcrumbSchema(props: BreadcrumbSchemaProps) {
  const schema = generateBreadcrumbSchema(props);
  return <SeoSchema schemas={schema} />;
}

export function ServiceSchema(props: ServiceSchemaProps) {
  const schema = generateServiceSchema(props);
  return <SeoSchema schemas={schema} />;
}
