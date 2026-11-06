/**
 * JSON-LD (schema.org) generado desde la configuración.
 * Solo se emiten datos con verificado: true (vía dato()).
 */
import { EMPRESA, ZONAS_EMPRESA, dato } from '../config/empresa';
import { SITE_URL } from '../config/site';
import type { Lang } from '../config/site';
import type { Inmueble } from './propiedades';
import { tituloDe, descripcionDe } from './propiedades';
import { path } from './i18n';

const abs = (p: string) => SITE_URL.replace(/\/$/, '') + p;

export function agenciaSchema() {
  const horario = dato(EMPRESA.horario);
  const fundacion = dato(EMPRESA.fundacion);
  const geo = dato(EMPRESA.geo);
  const agencia: Record<string, unknown> = {
    '@type': 'RealEstateAgent',
    '@id': abs('/#agencia'),
    name: dato(EMPRESA.nombreComercial),
    url: SITE_URL,
    telephone: dato(EMPRESA.telefono)?.replace(/\s/g, ''),
    email: dato(EMPRESA.email),
    address: {
      '@type': 'PostalAddress',
      streetAddress: dato(EMPRESA.direccion),
      postalCode: dato(EMPRESA.codigoPostal),
      addressLocality: dato(EMPRESA.municipio),
      addressRegion: dato(EMPRESA.provincia),
      addressCountry: 'ES',
    },
    areaServed: Object.values(ZONAS_EMPRESA).map((z) => dato(z)).filter(Boolean),
    sameAs: [`https://www.instagram.com/${dato(EMPRESA.instagram)}/`],
  };
  if (geo) agencia.geo = { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng };
  if (fundacion) agencia.foundingDate = String(fundacion);
  if (dato(EMPRESA.razonSocial)) agencia.legalName = dato(EMPRESA.razonSocial);
  if (dato(EMPRESA.cif)) agencia.vatID = dato(EMPRESA.cif);
  if (horario) {
    agencia.openingHoursSpecification = [horario.manana, horario.tarde].map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: h.abre,
      closes: h.cierra,
    }));
  }
  return agencia;
}

export function webSchema(lang: Lang) {
  return {
    '@type': 'WebSite',
    '@id': abs('/#web'),
    url: SITE_URL,
    name: dato(EMPRESA.nombreComercial),
    inLanguage: lang,
    publisher: { '@id': abs('/#agencia') },
  };
}

export function breadcrumbSchema(items: { nombre: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nombre,
      item: abs(it.href),
    })),
  };
}

export function inmuebleSchema(i: Inmueble, lang: Lang, imagenes: string[]) {
  const url = abs(path(lang, 'inmuebles', i.slug));
  const esAlquiler = i.operacion === 'alquiler';
  return {
    '@type': 'RealEstateListing',
    '@id': url + '#listado',
    url,
    name: tituloDe(i, lang),
    description: descripcionDe(i, lang),
    image: imagenes,
    datePosted: '2026-11-01',
    about: {
      '@type': i.tipo === 'casa' ? 'House' : i.tipo === 'local' ? 'CommercialProperty' : 'Apartment',
      numberOfRooms: i.habitaciones,
      numberOfBathroomsTotal: i.banos,
      floorSize: { '@type': 'QuantitativeValue', value: i.superficie, unitCode: 'MTK' },
      address: { '@type': 'PostalAddress', addressLocality: i.municipio, addressRegion: 'Barcelona', addressCountry: 'ES' },
    },
    offers: {
      '@type': 'Offer',
      price: i.precio,
      priceCurrency: 'EUR',
      ...(esAlquiler
        ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: i.precio, priceCurrency: 'EUR', unitText: 'MONTH' } }
        : {}),
      availability: 'https://schema.org/InStock',
      seller: { '@id': abs('/#agencia') },
    },
  };
}

export function grafo(...nodos: Record<string, unknown>[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodos });
}
