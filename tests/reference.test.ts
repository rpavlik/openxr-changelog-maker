
import { ValidRefTypes, AllRepos, RefTypes, RefType, isReferenceValid, GitHubRepo } from '../src/shared/reference';

test('has valid ref types for all repos', () => {
    for (const repo of AllRepos) {
        expect(ValidRefTypes[repo]).toContain('Issue');
        if (repo == 'gl') {
            expect(ValidRefTypes[repo]).toContain(RefTypes.MergeRequest);
        } else {
            expect(ValidRefTypes[repo]).toContain(RefTypes.PullRequest);
        }
    }
});

test('can distinguish valid from invalid', () => {
    for (const repo of AllRepos) {
        expect(isReferenceValid({ repo: repo, refType: 'Issue', refNumber: 5 })).toBeTruthy();
    }
    expect(isReferenceValid({ repo: 'gl', refType: 'Merge Request', refNumber: 5 })).toBeTruthy();
    expect(isReferenceValid({ repo: 'gl', refType: 'Pull Request', refNumber: 5 })).toBeFalsy();

    for (const repo of ['gh.OpenXR-Docs', 'gh.OpenXR-SDK-Source', 'gh.OpenXR-CTS']) {
        let myRepo = (repo as GitHubRepo);
        expect(isReferenceValid({ repo: myRepo, refType: 'Pull Request', refNumber: 5 })).toBeTruthy();
        expect(isReferenceValid({ repo: myRepo, refType: 'Merge Request', refNumber: 5 })).toBeFalsy();
    }
});