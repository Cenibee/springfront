package toy.cenibee.springfront.payroll;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// 1. @Component 에 의해 이 클래스는 @SpringBootApplication 에 의해 스캐닝 된다.
@Component
// 2. CmmandLineRunner 를 구현함으로써 모든 빈들이 생성/등록된 후에 동작이 실행된다.
public class DatabaseLoader implements CommandLineRunner {

    private final EmployeeRepository repository;

    // 3. 생성자를 이용한 의존성 주입으로 EmployeeRepository 가 주입된다.
    @Autowired
    public DatabaseLoader(EmployeeRepository repository) {
        this.repository = repository;
    }

    // 4. run() 메서드는 커맨드 라인 인자들과 함께 실행되어 데이터를 로드한다.
    @Override
    public void run(String... args) throws Exception {
        this.repository.save(new Employee("Frodo", "Baggins", "ring bearer"));
        this.repository.save(new Employee("Bilbo", "Baggins", "burglar"));
        this.repository.save(new Employee("Gandalf", "the Grey", "wizard"));
        this.repository.save(new Employee("Samwise", "Gamgee", "gardener"));
        this.repository.save(new Employee("Meriadoc", "Brandybuck", "pony rider"));
        this.repository.save(new Employee("Peregrin", "Took", "pipe smoker"));
    }
}
