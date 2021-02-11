package toy.cenibee.springfront.payroll;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import toy.cenibee.springfront.payroll.manager.Manager;
import toy.cenibee.springfront.payroll.manager.ManagerRepository;

// 1. @Component 에 의해 이 클래스는 @SpringBootApplication 에 의해 스캐닝 된다.
@Component
// 2. CmmandLineRunner 를 구현함으로써 모든 빈들이 생성/등록된 후에 동작이 실행된다.
public class DatabaseLoader implements CommandLineRunner {

    private final EmployeeRepository employees;

    private final ManagerRepository managers;

    // 3. 생성자를 이용한 의존성 주입으로 EmployeeRepository 가 주입된다.
    @Autowired
    public DatabaseLoader(EmployeeRepository employees, ManagerRepository managers) {
        this.employees = employees;
        this.managers = managers;
    }

    // 4. run() 메서드는 커맨드 라인 인자들과 함께 실행되어 데이터를 로드한다.
    @Override
    public void run(String... args) throws Exception {

        Manager greg = this.managers.save(new Manager("greg", "greg", "ROLE_MANAGER"));

        Manager oliver = this.managers.save(new Manager("oliver", "oliver", "ROLE_MANAGER"));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("greg", "doesn't matter",
                        AuthorityUtils.createAuthorityList("ROLE_MANAGER"))
        );

        this.employees.save(new Employee("Frodo", "Baggins", "ring bearer", greg));
        this.employees.save(new Employee("Bilbo", "Baggins", "burglar", greg));
        this.employees.save(new Employee("Gandalf", "the Grey", "wizard", greg));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("oliver", "doesn't matter",
                        AuthorityUtils.createAuthorityList("ROLE_MANAGER"))
        );

        this.employees.save(new Employee("Samwise", "Gamgee", "gardener", oliver));
        this.employees.save(new Employee("Meriadoc", "Brandybuck", "pony rider", oliver));
        this.employees.save(new Employee("Peregrin", "Took", "pipe smoker", oliver));

        SecurityContextHolder.clearContext();
    }
}
