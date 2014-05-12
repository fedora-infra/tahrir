<%inherit file="badge-base.mak" />
            <p>${', '.join(filter(None, [self.functions.link_person_nickname(a.person) for a in badge_assertions]))}</p>
