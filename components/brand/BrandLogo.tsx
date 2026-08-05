import Image from 'next/image';
import Link from 'next/link';
import styles from './BrandLogo.module.css';

export function BrandLogo({variant='horizontal',size='md',className='',href='/'}:{variant?:'horizontal'|'mark';size?:'sm'|'md'|'lg';className?:string;href?:string}){
  const mark=variant==='mark';
  return <Link href={href} className={`${styles.logo} ${styles[size]} ${mark?styles.mark:styles.horizontal} ${className}`} aria-label="SourceMetric home"><Image src={mark?'/brand/sourcemetric-mark-256.png':'/brand/sourcemetric-logo.png'} alt="SourceMetric" width={mark?1254:1984} height={mark?1254:793} priority={size==='lg'}/></Link>;
}
