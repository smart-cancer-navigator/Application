/**
 * CIViC (Clinical Interpretations of Variants in Cancer) is a database which provides genes, variants,
 * and variant types for a wide variety of cancer-causing factors.
 */
import { GeneDataProvider, VariantDataProvider, VariantTypeDataProvider } from './database-services.interface';
import { Observable } from 'rxjs/Observable';
import { Gene, Variant, VariantType } from './genomic-data';
import { Http } from '@angular/http';

export class CIViCSearchService implements GeneDataProvider, VariantDataProvider, VariantTypeDataProvider {

  constructor (private http: Http) {}

  public provideGenes = (searchTerm: string): Observable<Gene[]> => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', '1');
    params.set('count', '1000');

    return this.http
      .get(`https://civic.genome.wustl.edu/api/genes`, {search: params})
      .map(response => response.json().data)
      .map(responseJSON => {
        const genes: Gene[] = [];
        for (const record of responseJSON.records) {
          console.log('Adding new record', record);
          if (record.name.toLowerCase().startsWith(searchTerm.toLowerCase())) {
            genes.push(new Gene(record.name, record.id));
          }
        }
        return genes;
      });
  }

  public provideVariants = (searchTerm: string, additionalContext: Gene): Observable<Variant[]> => {
    return null;
  }

  public provideVariantTypes = (searchTerm: string, additionalContext: Variant): Observable<VariantType[]> => {
    return null;
  }
}
