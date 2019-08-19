## Approach Outline (hoping to finish parts 1-3 by wednesday 8/14 ~11a)

1. Write a new servic**e to query cancervariants.com based on the given hgvs_id (based off of mygeneinfo-search.service.ts)
2. Show the results in a table on a new tab (
3. For each hit in the response, map it to the fields in an “association” object that Jamie writes up (can just put it all in as text at first)
4. Write a new component/tab (based off variant-information.component.ts) that displays the info for each association.
5. Add a new tab to variant-visualization.component.ts to display the new table

Sample hgvs id:
BRAF (gene) V600E

Can search https://search.cancervariants.org/api/v1/ui/#!/Associations/searchAssociations
with q=chr7\:g.140453136A>T

### Update 8/12:
X Added component and service for associations, need to refactor upstream to get called
	JJ: Great work!
	
### Next steps 8/12
1. Add Association search service to original Injectable on variant-selector.service.ts
    1. Add the database and interface
    2. Add a public search function to get associations from a variant
2. Call the new search function on variant-entry-and-visualization.component.ts

### Next next steps 8/12:
Currently the code takes a search term and creates a Variant object, which then has a FHIR representation which gets attached to the patient.
Once this variant is created (or grabbed by the SMART api from the patient’s medical records), we want to THEN search for associations and create Assoc objects in FHIR and add those to a tab to be displayed.

### Update 8/13
Table generating on Association tab
1. Provide top 20 for now
2. Try to figure out the api “sort” function - want to prioritize results by evidence_level (1-4)
3. Idea I believe, is to aggregate associations based on drugs and diseases, but don’t want to get too far into visualization work down a different direction than needed...
    - Wow! Push the new code to github and I’ll show it off to Dr. Warner

### Question
- features only have entrez_id
- connot sort by field name
